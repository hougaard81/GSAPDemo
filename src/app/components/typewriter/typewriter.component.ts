import { Component, ElementRef, Input, NgZone, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

@Component({
  selector: 'app-typewriter',
  standalone: true,
  imports: [],
  templateUrl: './typewriter.component.html',
  styleUrl: './typewriter.component.scss'
})
export class TypewriterComponent implements OnInit {
  @Input() text: string = 'Welcome to Angular GSAP Logo Demo';
  @Input() duration: number = 2;
  @Input() logoAnimationDuration: number = 1;
  @Input() typingSpeed: number = 50; // ms per character
  @Input() errorProbability: number = 0.05;
  @Input() mistakeDuration: number = 300;
  
  private currentText: string = '';
  private targetText: string = '';
  private timeoutId: any;
  
  constructor(
    private el: ElementRef,
    private ngZone: NgZone
  ) {
    gsap.registerPlugin(TextPlugin);
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initializeAnimation();
    });
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private initializeAnimation(): void {
    const textElement = this.el.nativeElement.querySelector('.typewriter-text');
    
    const tl = gsap.timeline();

    // Initial setup
    gsap.set(textElement, { text: '', scale: 0, opacity: 0 });

    // Logo animation
    tl.to(textElement, {
      duration: this.logoAnimationDuration,
      scale: 1,
      opacity: 1,
      ease: "back.out(1.7)"
    });

    // Short pause before typing
    tl.to({}, { duration: 0.3 });

    // Start typewriter effect
    tl.call(() => {
      this.startTypewriter(textElement);
    });
  }

  private startTypewriter(element: HTMLElement): void {
    this.targetText = this.text;
    this.typeNextCharacter(element);
  }

  private typeNextCharacter(element: HTMLElement): void {
    if (this.currentText.length < this.targetText.length) {
      const shouldMakeError = Math.random() < this.errorProbability;
      
      if (shouldMakeError) {
        // Make a typing mistake
        const wrongChar = this.getRandomChar();
        this.currentText += wrongChar;
        element.textContent = this.currentText;
        
        // Schedule error correction
        this.timeoutId = setTimeout(() => {
          // Remove wrong character
          this.currentText = this.currentText.slice(0, -1);
          element.textContent = this.currentText;
          
          // Continue with correct character after a brief pause
          this.timeoutId = setTimeout(() => {
            this.currentText += this.targetText[this.currentText.length];
            element.textContent = this.currentText;
            this.scheduleNextCharacter(element);
          }, this.mistakeDuration / 2);
        }, this.mistakeDuration);
      } else {
        // Type correct character
        this.currentText += this.targetText[this.currentText.length];
        element.textContent = this.currentText;
        this.scheduleNextCharacter(element);
      }
    }
  }

  private scheduleNextCharacter(element: HTMLElement): void {
    // Vary typing speed slightly for more natural effect
    const variableSpeed = this.typingSpeed * (0.8 + Math.random() * 0.4);
    this.timeoutId = setTimeout(() => {
      this.typeNextCharacter(element);
    }, variableSpeed);
  }

  private getRandomChar(): string {
    // Get a random character near the intended one on the keyboard
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    return chars.charAt(Math.floor(Math.random() * chars.length));
  }
}