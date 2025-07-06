import { Component, inject, OnInit } from '@angular/core';
import { UserRoleService } from '../../services/user-role.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  template: `
    <div class="debug-info">
      <p><strong>Debug:</strong> AdminPanel component loaded</p>
      <p><strong>Service isAdmin$:</strong> {{ userRoleService.isAdmin$() | async }}</p>
      <p><strong>Service isAuthenticated$:</strong> {{ userRoleService.isAuthenticated$() | async }}</p>
    </div>
    
    @if (userRoleService.isAdmin$() | async) {
      <div class="admin-panel">
        <h2>Panneau d'administration</h2>
        <p>Bienvenue {{ userRoleService.userName$() | async }}, vous avez accès au panneau admin.</p>
        
        <div class="user-info">
          <h3>Informations utilisateur</h3>
          <p><strong>Nom d'utilisateur:</strong> {{ userRoleService.userName$() | async }}</p>
          <p><strong>Authentifié:</strong> {{ (userRoleService.isAuthenticated$() | async) ? 'Oui' : 'Non' }}</p>
          <p><strong>Admin:</strong> {{ (userRoleService.isAdmin$() | async) ? 'Oui' : 'Non' }}</p>
          <p><strong>Groupes:</strong></p>
          <ul>
            @for (group of (userRoleService.groups$() | async); track group) {
              <li>{{ group }}</li>
            }
          </ul>
        </div>
      </div>
    } @else {
      <div class="access-denied">
        <p>Accès refusé. Vous devez être administrateur pour accéder à cette section.</p>
        <p><strong>Debug:</strong> isAdmin = {{ userRoleService.isAdmin$() | async }}</p>
      </div>
    }
  `,
  imports: [AsyncPipe],
  styles: [`
    .debug-info {
      padding: 10px;
      border: 1px solid #007bff;
      background-color: #e7f3ff;
      margin-bottom: 20px;
    }
    
    .admin-panel {
      padding: 20px;
      border: 2px solid #28a745;
      border-radius: 8px;
      background-color: #f8f9fa;
    }
    
    .access-denied {
      padding: 20px;
      border: 2px solid #dc3545;
      border-radius: 8px;
      background-color: #f8d7da;
      color: #721c24;
    }
    
    .user-info {
      margin-top: 20px;
      padding: 15px;
      background-color: white;
      border-radius: 4px;
    }
  `]
})
export class AdminPanelComponent implements OnInit {
  protected userRoleService = inject(UserRoleService);
  
  ngOnInit() {
    this.userRoleService.userInfo$.subscribe(userInfo => {
    });
  }
}
