import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import {
  AlertController,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { CounterService } from '../services/counter.service';

type SortField = 'name' | 'value';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    DatePipe,
    DecimalPipe,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSegment,
    IonSegmentButton,
    IonSearchbar,
    IonSpinner,
    IonTitle,
    IonToolbar,
  ],
})

export class Tab2Page implements OnInit {
  readonly counterService = inject(CounterService);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);
  readonly totalValue = computed(() =>
    this.counterService
      .counters()
      .reduce((total, counter) => total + counter.value, 0),
  );
  readonly averageValue = computed(() => {
    const count = this.counterService.counters().length;
    const average = this.totalValue() / count;
    return average || 0;
  });

  readonly sortBy = signal<SortField>('name');
  readonly searchTerm = signal('');

  readonly sortedCounters = computed(() => {
    const searchTerm = this.searchTerm().trim().toLocaleLowerCase();
    const counters = [...this.counterService.counters()].filter((counter) =>
      counter.name.toLocaleLowerCase().includes(searchTerm),
    );

    if (this.sortBy() === 'name') {
      return counters.sort((a, b) => a.name.localeCompare(b.name));
    }

    return counters.sort((a, b) => a.value - b.value);
  });

  setSortBy(value: unknown): void {
    if (value === 'name' || value === 'value') {
      this.sortBy.set(value);
    }
  }

  async ngOnInit(): Promise<void> {
    await this.counterService.initialize();
  }

  async remove(id: string): Promise<void> {
    await this.counterService.remove(id);

    const toast = await this.toastController.create({
      message: 'Záznam byl odstraněn.',
      duration: 2000,
      position: 'bottom',
      positionAnchor: 'main-tab-bar',
    });
    await toast.present();
  }

  async clear(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Opravdu vymazat historii?',
      message: 'Všechny uložené záznamy budou odstraněny.',
      buttons: [
        {
          text: 'Zrušit',
          role: 'cancel',
        },
        {
          text: 'Vymazat vše',
          role: 'destructive',
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    if (role === 'destructive') {
      await this.counterService.clear();

      const toast = await this.toastController.create({
        message: 'Historie byla vymazána.',
        duration: 2000,
        position: 'bottom',
        positionAnchor: 'main-tab-bar',
      });
      await toast.present();
    }
  }
}