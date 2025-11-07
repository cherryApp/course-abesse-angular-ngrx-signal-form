import { computed, inject, signal } from '@angular/core';
import { User } from '../model/user';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { UserService } from '../service/user.service';
import { firstValueFrom } from 'rxjs';

export interface UserState {
  users: User[];
  loading: boolean;
  selectedUser: User | null;
  error: string | null;
}

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState<UserState>({
    users: [],
    loading: false,
    selectedUser: null,
    error: null,
  }),
  withMethods((store, userService = inject(UserService)) => ({
    async loadUsers() {
      if (store.users().length > 0) {
        return;
      }

      patchState(store, { loading: true });
      try {
        const users = await firstValueFrom(userService.getUsers());
        patchState(store, { users });
      } catch (e) {
        patchState(store, { error: String(e) });
      } finally {
        patchState(store, { loading: false });
      }
    },
  })),
  withComputed((store) => ({
    userCount: () => store.users().length,
    hasUsers: () => store.users().length > 0,
  }))
);
