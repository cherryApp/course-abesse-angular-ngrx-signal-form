import { Component, input } from '@angular/core';
import { Field } from '@angular/forms/signals';
import { FieldDef } from '../form-utils';

@Component({
  selector: 'app-dynamic-form',
  template: `
    @for(fieldDef of metaInfo(); track fieldDef.name) { @let field = dynamicForm()[fieldDef.name];
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">
        {{ fieldDef.label }}
      </label>

      @switch (fieldDef.type) { @case ('select') {
      <select
        [field]="field"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        @for(option of fieldDef.options; track option.value) {
        <option [value]="option.value">{{ option.label }}</option>
        }
      </select>
      } @case ('textarea') {
      <textarea
        [field]="field"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        rows="4"
      >
      </textarea>
      } @default {
      <input
        [field]="field"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      } } @if (field && field().errors && field().errors().length > 0) {
      <p class="text-red-500 text-xs italic mt-1">
        {{ getErrorMessage(field().errors()[0]) }}
      </p>
      }
    </div>
    }
  `,
  standalone: true,
  imports: [Field],
})
export class DynamicFormComponent {
  metaInfo = input.required<FieldDef[]>();
  dynamicForm = input.required<any>();

  getErrorMessage(error: any): string {
    if (!error) return '';

    switch (error.kind) {
      case 'required':
        return 'This field is required';
      case 'email':
        return 'Please enter a valid email';
      case 'minLength':
        return `Minimum length is ${error.minLength} characters`;
      case 'maxLength':
        return `Maximum length is ${error.maxLength} characters`;
      case 'pattern':
        return 'Invalid format';
      default:
        return error.message || 'Invalid value';
    }
  }
}
