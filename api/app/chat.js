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

const sendMessageToUsers = (type, data, denyIds = []) => {
    Object.keys(activeConnections.users).forEach((id) => {
        if (!denyIds.includes(id)) {
            const user = activeConnections.users[id];
            sendUserMessage(user.ws, type, data);
        }
    });
};

module.exports = (ws, req) => {
    let userId = nanoid();
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
                    activeConnections.users[user._id] = { ws, user };

                    userId = user._id.toString();
                    userData = activeConnections.users[user._id];

                    console.log(`Connection with id: ${userId} is identified: `, user.email);

                    const connectedUsers = Object.keys(activeConnections.users).map((id) => {
                        const user = activeConnections.users[id].user;
                        return {
                            _id: user._id,
                            displayName: user.displayName,
                        };
                    });
                    sendUserMessage(ws, 'CONNECTED_USERS', { users: connectedUsers });

                    const messages = await Message.find({$or: [
                            {recipient: userId},
                            {recipient: null}
                        ]})
                        .populate('user', 'displayName')
                        .sort({_id: -1})
                        .limit(30);

                    sendUserMessage(ws, 'MESSAGES', { messages: messages.reverse() });

                    sendMessageToUsers('CONNECTED_USERS', {
                        users : [{
                            _id: userData.user._id,
                            displayName: userData.user.displayName,
                        }]
                    }, [userId]);

                    break;
                case 'MESSAGE':
                    if (!userData) {
                        return;
                    }

                    const messageData = {
                        user: userId,
                        message: decodedMessage.message
                    };

                    if (decodedMessage.recipient) {
                        if (!Object.keys(activeConnections.users).includes(decodedMessage.recipient)) {
                            return;
                        }

                        messageData['recipient'] = decodedMessage.recipient;
                    }

                    const message = new Message(messageData);
                    await message.save();

                    if (decodedMessage.recipient) {
                        const recipientUser = activeConnections.users[decodedMessage.recipient];
                        sendUserMessage(recipientUser.ws, 'MESSAGES', {
                            messages: [{
                                _id: message._id,
                                user: {
                                    _id: userId,
                                    displayName: userData.user.displayName,
                                },
                                message: decodedMessage.message
                            }]
                        });

                        return;
                    }

                    sendMessageToUsers('MESSAGES', {
                        messages: [{
                            _id: message._id,
                            user: {
                                _id: userId,
                                displayName: userData.user.displayName,
                            },
                            message: decodedMessage.message
                        }]
                    });

                    break;
                case 'REMOVE_MESSAGE':
                    if (!userData) {
                        return;
                    }

                    if (userData.user.role !== 'admin') {
                        return;
                    }

                    const mess = await Message.findById(decodedMessage.id);
                    if (!mess) {
                        return;
                    }
                    await mess.remove();

                    sendMessageToUsers('REMOVE_MESSAGE', {
                        _id: decodedMessage.id,
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

        sendMessageToUsers('USER_DISCONNECTED', { _id: userId });
        userData = null;
    });
};