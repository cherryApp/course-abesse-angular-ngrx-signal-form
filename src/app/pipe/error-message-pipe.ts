import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrorWithField } from '@angular/forms/signals';

@Pipe({
  name: 'errorMessage',
})
export class ErrorMessagePipe implements PipeTransform {
  transform(value: ValidationErrorWithField): string {
    if (!value) {
      return '';
    }

    return value.message ?? value.kind;
  }
}
