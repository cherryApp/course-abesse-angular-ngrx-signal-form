import { Component, inject, OnInit } from '@angular/core';
import { UserStore } from '../../stores/user.store';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [NgClass, RouterLink],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  userStore = inject(UserStore);

  users = this.userStore.users;

  ngOnInit(): void {
    this.userStore.loadUsers();
  }
}
