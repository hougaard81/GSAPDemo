import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, NgZone, Renderer2, ViewChild } from '@angular/core';
import { gsap } from 'gsap';



@Component({
  selector: 'app-animated-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './animated-logo.component.html',
  styleUrl: './animated-logo.component.scss'
})
export class AnimatedLogoComponent implements AfterViewInit {
  @ViewChild('logoWrapper', { static: true }) logoWrapper!: ElementRef;

  private hoverTl!: gsap.core.Timeline;
  private breathingTl!: gsap.core.Timeline;

  constructor(private ngZone: NgZone, private renderer: Renderer2) {
    if (!gsap) {
      console.error('GSAP not loaded');
      return;
    }
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.initAnimation();
      this.setupHoverAnimation();
    });
  }

  private initAnimation() {
    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => this.startBreathingAnimation()
    });
  
    const animatedRect = this.logoWrapper.nativeElement.querySelector('.animated-rect');
    const letters = this.logoWrapper.nativeElement.querySelectorAll('.letter');
  
    gsap.set(animatedRect, { rx: 0, ry: 0, fill: '#af4261' });
    // Initial animation
    tl.fromTo(animatedRect, 
      { rx: 0, ry: 0, fill: '#af4261' }, // Start as square
      {
        rx: 50, ry: 50, // Animate to circle
        fill: '#f3ec78',
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
      }
    ).to(letters, {
      opacity: 1,
      y: 0,
      fill: '#af4261',
      duration: 0.4,
      stagger: 0.03,
    }, '-=0.3');
  }
  
  private startBreathingAnimation() {
    const animatedRect = this.logoWrapper.nativeElement.querySelector('.animated-rect');
    const letters = this.logoWrapper.nativeElement.querySelectorAll('.letter');
  
    this.breathingTl = gsap.timeline({
      repeat: -1,
      yoyo: true,
    });
  
    // Breathing animation for shape and text color
    this.breathingTl
      .to(animatedRect, {
        rx: 0, ry: 25, // Morph into rounded rectangle
        fill: '#af4261',
        duration: 2,
        ease: "power1.inOut"
      })
      .to(letters, {
        fill: '#f3ec78', // Change text color to match
        duration: 2,
        ease: "power1.inOut",
        stagger: 0.1
      }, '<') // Sync with animatedRect fill change
      .to(animatedRect, {
        rx: 50, ry: 50, // Back to circle
        fill: '#f3ec78',
        duration: 2,
        ease: "power1.inOut"
      })
      .to(letters, {
        fill: '#af4261', // Change text color to match
        duration: 2,
        ease: "power1.inOut",
        stagger: 0.1
      }, '<'); // Sync with animatedRect fill change
  }
  

  private setupHoverAnimation() {
    const animatedRect = this.logoWrapper.nativeElement.querySelector('.animated-rect');
    const wrapper = this.logoWrapper.nativeElement;

    this.hoverTl = gsap.timeline({ paused: true });
    
    this.hoverTl.to(animatedRect, {
      scale: 1.1,
      duration: 0.3,
      ease: "power2.out"
    });

    // Add hover listeners
    this.renderer.listen(wrapper, 'mouseenter', () => {
      this.breathingTl.pause();
      this.hoverTl.play();
    });

    this.renderer.listen(wrapper, 'mouseleave', () => {
      this.hoverTl.reverse();
      this.breathingTl.resume();
    });
  }
}
