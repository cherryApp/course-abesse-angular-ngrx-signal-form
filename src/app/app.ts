import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserStore } from './stores/user.store';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly userStore = inject(UserStore);

  protected readonly title = signal('course-abesse-angular-ngrx-signal-form');

  users = this.userStore.users;

  ngOnInit(): void {
    this.userStore.loadUsers();
  }
}
