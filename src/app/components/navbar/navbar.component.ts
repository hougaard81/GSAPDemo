import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AnimatedLogoComponent } from '../animated-logo/animated-logo.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, AnimatedLogoComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

}
