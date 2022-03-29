const { nanoid } = require('nanoid');
const User = require('../models/User');
const Message = require('../models/Message');

const activeConnections = {
    'users': {},
    'unknown': {}
};

const sendUserMessage = (userWs, type, data) => {
    const message = { type, ...data };
    userWs.send(JSON.stringify(message));
};

const sendMessageToUsers = (type, data) => {
    Object.keys(activeConnections.users).forEach((id) => {
        const user = activeConnections.users[id];
        sendUserMessage(user.ws, type, data);
    });
};

module.exports = (ws, req) => {
    const userId = nanoid();
    let userData = null;

    activeConnections.unknown[userId] = ws;
    console.log('Connected unknown user', userId);

    ws.on('message', async (msg) => {
        try {
            const decodedMessage = JSON.parse(msg);
            switch (decodedMessage.type) {
                case 'AUTH':
                    const user = await User.findOne({ token: decodedMessage.token });
                    if (!user) {
                        return;
                    }

                    delete activeConnections.unknown[userId];
                    activeConnections.users[userId] = { ws, user };
                    userData = user;

                    console.log(`Connection with id: ${userId} is identified: `, user.email);

                    const connectedUsers = Object.keys(activeConnections.users).map((id) => {
                        const user = activeConnections.users[id].user;
                        return {
                            id: user._id,
                            displayName: user.displayName,
                        };
                    });
                    sendUserMessage(ws, 'CONNECTED_USERS', {
                        users: connectedUsers
                    });

                    const messages = await Message.find()
                        .populate('user', 'displayName')
                        .sort({_id: -1})
                        .limit(30);

                    sendUserMessage(ws, 'MESSAGES', {
                        messages: messages.reverse()
                    });

                    Object.keys(activeConnections.users).forEach((id) => {
                        if (id === userId) {
                            return;
                        }

                        const user = activeConnections.users[id];
                        sendUserMessage(user.ws, 'CONNECTED_USERS', {
                            users : [{
                                id: userData._id,
                                displayName: userData.displayName,
                            }]
                        });
                    });

                    break;
                case 'MESSAGE':
                    if (!userData) {
                        return;
                    }

                    const messageData = {
                        user: userData._id,
                        message: decodedMessage.message
                    };

                    const message = new Message(messageData);
                    await message.save();

                    sendMessageToUsers('MESSAGES', {
                        messages: [{
                            user: {
                                _id: userData._id,
                                displayName: userData.displayName,
                            },
                            message: decodedMessage.message
                        }]
                    });

                    break;
                default:
                    console.log('Unknown type', decodedMessage.type);
            }
        } catch(e) {
            console.log(e);
        }
    });

    ws.on('close', () => {
        if (!userData) {
            console.log('Connected unknown user with id is disconnected', userId);

            delete activeConnections.unknown[userId];
            return;
        }

        console.log('Connected user with id is disconnected', userId);
        delete activeConnections.users[userId];

        sendMessageToUsers('USER_DISCONNECTED', {
            id: userData._id,
        });
        userData = null;
    });
};