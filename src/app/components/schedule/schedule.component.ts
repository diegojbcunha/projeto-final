import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Training, LearningPath, TrainingService } from '../../services/training.service';

interface CalendarEvent {
  id?: string;
  title: string;
  date: string;
  type: string;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps?: { type: string };
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit, OnDestroy {
  private service = inject(TrainingService);

  isAdmin = true;
  showForm = false;
  editingEvent = false;
  showEventActionModal = false;
  currentEvent: CalendarEvent = { title: '', date: '', type: 'Training' };
  selectedEvent: CalendarEvent | null = null;
  customEvents: CalendarEvent[] = [];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    events: [],
    eventClick: this.handleEventClick.bind(this),
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' },
    height: 'auto',
    editable: this.isAdmin
  };

  ngOnInit() {
    this.loadEvents();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  loadEvents() {
    const trainings: Training[] = this.service.getTrainings();
    const paths: LearningPath[] = this.service.getPaths();

    const today = new Date();
    const trainingDeadlines = trainings.map((t: Training) => ({
      id: `training-${t.id}`,
      title: `${t.title} - Deadline`,
      date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      backgroundColor: '#47A8E5',
      borderColor: '#2A6BAC',
      extendedProps: { type: 'Training' }
    }));

    const pathStarts = paths.map((p: LearningPath) => ({
      id: `path-${p.id}`,
      title: `${p.title} - Start`,
      date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      backgroundColor: '#2A6BAC',
      borderColor: '#133A7C',
      extendedProps: { type: 'Path' }
    }));

    this.calendarOptions.events = [...trainingDeadlines, ...pathStarts, ...this.customEvents];
  }

  handleEventClick(info: EventClickArg) {
    info.jsEvent.preventDefault();
    if (this.isAdmin) {
      this.selectedEvent = {
        id: info.event.id,
        title: info.event.title,
        date: info.event.startStr.split('T')[0],
        type: info.event.extendedProps?.['type'] || 'Training',
        backgroundColor: info.event.backgroundColor || '#47A8E5',
        borderColor: info.event.borderColor || '#2A6BAC'
      };
      this.showEventActionModal = true;
    }
  }

  editEvent() {
    if (this.selectedEvent) {
      this.currentEvent = { ...this.selectedEvent };
      this.editingEvent = true;
      this.showForm = true;
      this.showEventActionModal = false;
    }
  }

  deleteEvent() {
    if (this.selectedEvent && this.selectedEvent.id?.startsWith('custom-')) {
      this.customEvents = this.customEvents.filter(event => event.id !== this.selectedEvent!.id);
      this.loadEvents();
    }
    this.showEventActionModal = false;
    this.selectedEvent = null;
  }

  closeEventActionModal() {
    this.showEventActionModal = false;
    this.selectedEvent = null;
  }

  addEvent() {
    this.editingEvent = false;
    this.currentEvent = { title: '', date: '', type: 'Training' };
    this.showForm = true;
  }

  saveEvent(form: NgForm) {
    if (form.valid) {
      const newEvent: CalendarEvent = {
        id: this.editingEvent && this.currentEvent.id ? this.currentEvent.id : `custom-${Date.now()}`,
        title: this.currentEvent.title,
        date: this.currentEvent.date,
        type: this.currentEvent.type,
        backgroundColor: this.currentEvent.type === 'Training' ? '#47A8E5' : '#2A6BAC',
        borderColor: this.currentEvent.type === 'Training' ? '#2A6BAC' : '#133A7C',
        extendedProps: { type: this.currentEvent.type }
      };

      if (this.editingEvent) {
        // Update existing event
        const index = this.customEvents.findIndex(event => event.id === newEvent.id);
        if (index !== -1) {
          this.customEvents[index] = newEvent;
        }
      } else {
        // Add new event
        this.customEvents.push(newEvent);
      }

      this.loadEvents();
      this.showForm = false;
      this.currentEvent = { title: '', date: '', type: 'Training' };
      this.editingEvent = false;
      form.resetForm();
    }
  }

  cancelForm() {
    this.showForm = false;
    this.currentEvent = { title: '', date: '', type: 'Training' };
    this.editingEvent = false;
  }
}