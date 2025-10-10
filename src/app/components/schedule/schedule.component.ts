import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Training, LearningPath, TrainingService } from '../../services/training.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {
  private service = inject(TrainingService);

  isAdmin = true;

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
    // No custom logic for now
  }

  loadEvents() {
    const trainings: Training[] = this.service.getTrainings();
    const paths: LearningPath[] = this.service.getPaths();

    const today = new Date();
    const trainingDeadlines = trainings.map((t: Training) => ({
      id: `training-${t.id}`,
      title: `${t.title} - Deadline`,
      date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +7 dias fixo
      backgroundColor: '#47A8E5',
      borderColor: '#2A6BAC',
      extendedProps: { type: 'Training' }
    }));

    const pathStarts = paths.map((p: LearningPath) => ({
      id: `path-${p.id}`,
      title: `${p.title} - Start`,
      date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +3 dias fixo
      backgroundColor: '#2A6BAC',
      borderColor: '#133A7C',
      extendedProps: { type: 'Path' }
    }));

    this.calendarOptions.events = [...trainingDeadlines, ...pathStarts];
  }

  handleEventClick(info: EventClickArg) {
    // Basic click handler - just prevent default
    info.jsEvent.preventDefault();
  }
}
