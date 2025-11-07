import { Schema, required, email, minLength, maxLength, pattern, schema } from "@angular/forms/signals";
import { FieldPath } from "@angular/forms/signals";

export interface FieldDef {
  name: string;
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  type?: string;
  options?: { value: string; label: string }[];
  pattern?: RegExp;
}

export function toSchema(meta: FieldDef[]): Schema<unknown> {
  return schema<unknown>((path: any) => {
    for (const fieldDef of meta) {
      const prop = fieldDef.name;
      const fieldPath = path[prop];
      
      // Skip if field path doesn't exist
      if (!fieldPath) {
        continue;
      }
      
      // Apply required validator
      if (fieldDef.required) {
        required(fieldPath);
      }
      
      // Apply email validator for email fields
      if (fieldDef.type === 'email') {
        email(fieldPath);
      }
      
      // Apply minLength validator
      if (typeof fieldDef.minLength !== 'undefined') {
        minLength(fieldPath, fieldDef.minLength);
      }
      
      // Apply maxLength validator
      if (typeof fieldDef.maxLength !== 'undefined') {
        maxLength(fieldPath, fieldDef.maxLength);
      }
      
      // Apply pattern validator
      if (fieldDef.pattern) {
        pattern(fieldPath, fieldDef.pattern);
      }
    }
  });
}