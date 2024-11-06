import { Component, NgZone } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { TypewriterComponent } from './components/typewriter/typewriter.component';
import { gsap } from 'gsap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, TypewriterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'animated-logo-demo';

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.animateBackground();
    });
  }

  private animateBackground() {
    gsap.to('.content', {
      '--bg-position': '100%', // Animate background position from 0% to 100%
      duration: 10, // Adjust duration for desired speed
      ease: 'linear',
      repeat: -1, // Infinite loop
      yoyo: true // Reverses the animation for a seamless transition
    });
  }
}
