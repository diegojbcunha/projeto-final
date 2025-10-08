import { Component, signal, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Training, LearningPath, TrainingService } from '../../services/training.service'; // Confirme o path

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnDestroy {
  private service = inject(TrainingService);

  isAdmin = true;
  filter = signal<'All' | 'Trainings' | 'Paths'>('All');
  showForm = signal(false);
  editMode = signal(false);
  currentEvent = { 
    id: '', 
    title: '', 
    start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Data padrão: +7 dias
    type: 'Training' as 'Training' | 'Path' 
  };

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    events: [],
    eventClick: this.handleEventClick.bind(this),
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' },
    height: 'auto',
    editable: this.isAdmin
  };

  private allEvents: any[] = []; // Eventos fixos (de trainings/paths)
  private customEvents: any[] = []; // Eventos manuais (persistentes)
filterOptions: any;

  ngOnInit() {
    this.loadCustomEvents(); // Carrega custom do localStorage
    this.loadEvents(true); // Carrega fixos
  }

  ngOnDestroy() {
    this.saveCustomEvents(); // Salva custom no localStorage ao sair
  }

  loadEvents(initialLoad = false) {
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

    this.allEvents = [...trainingDeadlines, ...pathStarts]; // Fixos, regenerados sempre

    // Merge com custom (persistentes)
    const mergedEvents = [...this.customEvents, ...this.allEvents];

    if (initialLoad) {
      this.calendarOptions.events = mergedEvents;
    } else {
      // Aplica filtro
      const f = this.filter();
      this.calendarOptions.events = f === 'All' ? mergedEvents : mergedEvents.filter(e => e.extendedProps.type === f.toLowerCase());
    }
  }

  setFilter(f: 'All' | 'Trainings' | 'Paths') {
    this.filter.set(f);
    this.loadEvents(false); // Recarrega com merge, datas fixas para allEvents
  }

  addNew() {
    this.showForm.set(true);
    this.editMode.set(false);
    this.currentEvent = { 
      id: '', 
      title: '', 
      start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      type: 'Training' 
    };
  }

  handleEventClick(info: EventClickArg) {
    if (this.isAdmin) {
      this.editEvent(info.event);
    }
  }

  editEvent(event: any) {
    this.showForm.set(true);
    this.editMode.set(true);
    this.currentEvent = {
      id: event.id,
      title: event.title,
      start: event.startStr.split('T')[0], // Mantém a data exata do evento
      type: event.extendedProps.type as 'Training' | 'Path'
    };
  }

  saveEvent() {
    if (!this.currentEvent.title.trim()) {
      alert('Title is required!');
      return;
    }

    const newEvent = {
      id: this.currentEvent.id || `custom-${Date.now()}`,
      title: this.currentEvent.title,
      date: this.currentEvent.start, // Data escolhida persiste!
      backgroundColor: this.currentEvent.type === 'Training' ? '#47A8E5' : '#2A6BAC',
      borderColor: '#133A7C',
      extendedProps: { type: this.currentEvent.type }
    };

    if (this.editMode()) {
      // Atualiza no customEvents por ID
      const index = this.customEvents.findIndex(e => e.id === this.currentEvent.id);
      if (index > -1) {
        this.customEvents[index] = newEvent;
      }
    } else {
      // Adiciona ao customEvents
      this.customEvents.push(newEvent);
    }

    this.saveCustomEvents(); // Persiste no localStorage
    this.loadEvents(false); // Atualiza visual sem regenerar fixos
    this.showForm.set(false);
  }

  cancel() {
    this.showForm.set(false);
  }

  private loadCustomEvents() {
    const saved = localStorage.getItem('fordCustomEvents');
    if (saved) {
      this.customEvents = JSON.parse(saved);
    }
  }

  private saveCustomEvents() {
    localStorage.setItem('fordCustomEvents', JSON.stringify(this.customEvents));
  }

  trackById(index: number, item: any): number {
    return item.id || index;
  }
}