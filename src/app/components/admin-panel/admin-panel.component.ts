import { Component, inject } from '@angular/core';
import { UserRoleService } from '../../services/user-role.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
  imports: [AsyncPipe]
})
export class AdminPanelComponent {
  private userRoleService = inject(UserRoleService);

  protected readonly userName$ = this.userRoleService.userName$();
  protected readonly isAuthenticated$ = this.userRoleService.isAuthenticated$();
  protected readonly isAdmin$ = this.userRoleService.isAdmin$();
  protected readonly groups$ = this.userRoleService.groups$();
}
