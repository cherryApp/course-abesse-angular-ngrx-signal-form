import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserStore } from './stores/user.store';
import { JsonPipe } from '@angular/common';
import { Navigation } from './common/navigation/navigation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigation],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly userStore = inject(UserStore);

  protected readonly title = signal('course-abesse-angular-ngrx-signal-form');

  users = this.userStore.users;

  ngOnInit(): void {
    this.userStore.loadUsers();
  }
}
