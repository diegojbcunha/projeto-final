import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../services/training.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommended-courses-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommended-courses-carousel.component.html',
  styleUrls: ['./recommended-courses-carousel.component.css']
})
export class RecommendedCoursesCarouselComponent implements OnInit, OnDestroy {
  @Input() courses: Course[] = [];
  @Output() courseClick = new EventEmitter<Course>();

  currentIndex = 0;
  itemsPerSlide = 1;
  totalSlides!: number;
  slides: Course[][] = [];
  autoplayInterval: any;
  isPaused = false;

  // Touch handling
  private touchStartX = 0;
  private touchEndX = 0;

  constructor(private router: Router, private renderer: Renderer2, private el: ElementRef) {}

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
    if (!this.courses || this.courses.length === 0) return;

    this.calculateItemsPerSlide();
    this.slides = [];
    for (let i = 0; i < this.courses.length; i += this.itemsPerSlide) {
      this.slides.push(this.courses.slice(i, i + this.itemsPerSlide));
    }
    this.totalSlides = this.slides.length;
    if (this.currentIndex >= this.totalSlides) {
      this.currentIndex = 0;
    }
  }

  calculateItemsPerSlide() {
    const width = window.innerWidth;
    if (width >= 1024) {
      this.itemsPerSlide = 4;
    } else if (width >= 768) {
      this.itemsPerSlide = 3;
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

  trackById(index: number, item: Course): number {
    return item.id;
  }

  onCourseClick(course: Course) {
    this.courseClick.emit(course);
  }
}