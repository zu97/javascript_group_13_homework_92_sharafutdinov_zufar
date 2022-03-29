import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

export function identicalValidator(fields: string[], errorField: undefined | string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const uniqValues = fields.reduce((acc: string[], field) => {
        const value = control.get(field)?.value;
        const checkValue = acc.includes(value)

        if (!checkValue) {
          acc.push(value);
        }

        return acc;
    }, []);

    const isIdentical = fields.length >= 2 && uniqValues.length === 1;

    if (errorField) {
      const getErrorField = control.get(errorField);
      let errorFieldGetErrors: ValidationErrors | null = getErrorField?.errors || {};

      if (isIdentical) {
        delete errorFieldGetErrors['identical'];
      } else {
        errorFieldGetErrors['identical'] = true;
      }

      if (Object.keys(errorFieldGetErrors).length === 0) {
        errorFieldGetErrors = null;
      }

      getErrorField?.setErrors(errorFieldGetErrors);
    }

    if (isIdentical) {
      return null;
    }

    return {identical: true};
  };
}

@Directive({
  selector: '[appIdentical]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ValidateIdenticalDirective,
    multi: true
  }]
})
export class ValidateIdenticalDirective implements Validator {
  @Input('appIdentical') identicalFields: string[] = [];
  @Input('appIdenticalError') appIdenticalErrorField: undefined | string;

  validate(control: AbstractControl): ValidationErrors | null {
    return identicalValidator(this.identicalFields, this.appIdenticalErrorField)(control);
  }

}
