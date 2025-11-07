import {
  Component,
  effect,
  inject,
  input,
  InputSignalWithTransform,
  linkedSignal,
  Signal,
} from '@angular/core';
import { UserStore } from '../../stores/user.store';
import { email, Field, form, required } from '@angular/forms/signals';
import { User } from '../../model/user';
import { FormsModule } from '@angular/forms';
import { ErrorMessagePipe } from '../../pipe/error-message-pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-editor.component',
  imports: [Field, FormsModule, ErrorMessagePipe],
  templateUrl: './user-editor.component.html',
  styleUrl: './user-editor.component.css',
})
export class UserEditorComponent {
  userStore = inject(UserStore);

  router = inject(Router);

  id = input(0, { transform: (val: string) => parseInt(val) ?? 0 });

  user = linkedSignal<User>(() => {
    const selectedUser = this.userStore.selectedUser();
    return selectedUser ?? { id: 0, name: '', category: 'guest', email: '' };
  });

  errorMessage = this.userStore.error;

  userForm = form(this.user, (path) => {
    required(path.name);
    required(path.email);
    email(path.email);
    required(path.category);
  });

  constructor() {
    effect(() => {
      if (this.id()) {
        this.userStore.loadOneUser(this.id());
      }
    });
  }

  async onSubmit() {
    if (this.userForm().valid()) {
      await this.userStore.updateUser(this.user());

      if (!this.errorMessage()) {
        this.router.navigate(['users']);
      }
    }
  }

  onCancel() {
    this.router.navigate(['users']);
  }
}
