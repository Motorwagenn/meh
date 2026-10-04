import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
} from '@ionic/angular';
import { SavedCounter } from '../../models/saved-counter';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  imports: [
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonNote,
  ],
})
export class CounterComponent {
  readonly heading = input('Nové počítadlo');
  readonly savedCounters = input<SavedCounter[]>([]);
  readonly saved = output<SavedCounter>();
  readonly deleteRequested = output<string>();

  counterName = '';
  count = 0;

  get totalSavedValue(): number {
    return this.savedCounters().reduce(
      (total, counter) => total + counter.value,
      0,
    );
  }

  setCount(value: number | string | null): void {
    const parsedValue = Number(value);
    this.count = Number.isFinite(parsedValue)
      ? Math.max(0, Math.trunc(parsedValue))
      : 0;
  }

  increment(): void {
    this.count++;
  }

  decrement(): void {
    if (this.count > 0) {
      this.count--;
    }
  }

  reset(): void {
    this.count = 0;
  }

  save(): void {
    const name = this.counterName.trim();

    if (!name) {
      return;
    }

    this.saved.emit({
      id: crypto.randomUUID(),
      name,
      value: this.count,
    });

    this.counterName = '';
  }
}