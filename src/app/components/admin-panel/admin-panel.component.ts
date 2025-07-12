import { Component, inject, OnInit } from '@angular/core';
import { UserRoleService } from '../../services/user-role.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
  imports: [AsyncPipe]
})
export class AdminPanelComponent implements OnInit {
  protected userRoleService = inject(UserRoleService);
  
  ngOnInit() {
    this.userRoleService.userInfo$.subscribe(userInfo => {
    });
  }
}
