import { Component } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { CounterComponent } from '../components/counter/counter.component';
import { SavedCounter } from '../models/saved-counter';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    CounterComponent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
  ],
})
export class Tab1Page {
  leftCounters: SavedCounter[] = [];
  rightCounters: SavedCounter[] = [];

  onLeftSaved(counter: SavedCounter): void {
    this.leftCounters.unshift(counter);
  }

  onRightSaved(counter: SavedCounter): void {
    this.rightCounters.unshift(counter);
  }

  deleteLeftCounter(id: string): void {
    this.leftCounters = this.leftCounters.filter((counter) => counter.id !== id);
  }

  deleteRightCounter(id: string): void {
    this.rightCounters = this.rightCounters.filter((counter) => counter.id !== id);
  }
}