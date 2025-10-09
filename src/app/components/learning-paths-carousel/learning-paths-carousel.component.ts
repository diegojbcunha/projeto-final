import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningPathCardComponent } from '../learning-path-card/learning-path-card.component';
import { LearningPath } from '../../services/training.service';

@Component({
  selector: 'app-learning-paths-carousel',
  standalone: true,
  imports: [CommonModule, LearningPathCardComponent],
  templateUrl: './learning-paths-carousel.component.html',
  styleUrls: ['./learning-paths-carousel.component.css']
})
export class LearningPathsCarouselComponent implements OnInit, OnDestroy {
  @Input() learningPaths: LearningPath[] = []; // Array of learning paths
  @Input() isAdmin: boolean = false; // Flag to show admin controls

  @Output() editPathEvent = new EventEmitter<LearningPath>();
  @Output() deletePathEvent = new EventEmitter<number>();

  currentIndex = 0;
  itemsPerSlide = 1;
  totalSlides!: number;
  slides: any[][] = [];
  autoplayInterval: any;
  isPaused = false;

  // Touch handling
  private touchStartX = 0;
  private touchEndX = 0;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.updateSlides();
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateSlides();
  }

  updateSlides() {
    if (!this.learningPaths || this.learningPaths.length === 0) return;

    this.calculateItemsPerSlide();
    this.slides = [];
    for (let i = 0; i < this.learningPaths.length; i += this.itemsPerSlide) {
      this.slides.push(this.learningPaths.slice(i, i + this.itemsPerSlide));
    }
    this.totalSlides = this.slides.length;
    if (this.currentIndex >= this.totalSlides) {
      this.currentIndex = 0;
    }
  }

  calculateItemsPerSlide() {
    const width = window.innerWidth;
    if (width >= 1024) {
      this.itemsPerSlide = 3;
    } else if (width >= 768) {
      this.itemsPerSlide = 2;
    } else {
      this.itemsPerSlide = 1;
    }
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      if (!this.isPaused) {
        this.nextSlide();
      }
    }, 5000); // Change slide every 5 seconds
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  onMouseEnter() {
    this.isPaused = true;
  }

  onMouseLeave() {
    this.isPaused = false;
  }

  // Touch event handlers
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
    this.stopAutoplay();
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
    this.startAutoplay(); // Restart autoplay after swipe
  }

  private handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = this.touchStartX - this.touchEndX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        this.nextSlide(); // Swipe left - next
      } else {
        this.prevSlide(); // Swipe right - prev
      }
    }
  }

  getSlideStyle(index: number) {
    const translateX = -this.currentIndex * 100;
    return {
      transform: `translateX(${translateX}%)`
    };
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

  onEditPath(path: LearningPath) {
    this.editPathEvent.emit(path);
  }

  onDeletePath(id: number) {
    this.deletePathEvent.emit(id);
  }
}
