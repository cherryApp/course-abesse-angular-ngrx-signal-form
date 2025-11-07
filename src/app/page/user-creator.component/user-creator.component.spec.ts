import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreatorComponent } from './user-creator.component';

describe('UserCreatorComponent', () => {
  let component: UserCreatorComponent;
  let fixture: ComponentFixture<UserCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCreatorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
