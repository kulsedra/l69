import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'audio-player',
  imports: [CommonModule],
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnChanges {
  @Input() audioUrl: string | null = null;

  audioBlobUrl: string | null = null;

  loading = false;

  error: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['audioUrl'] && this.audioUrl) {
      this.fetchAudio(this.audioUrl);
    }
  }

  private async fetchAudio(url: string) {
    this.loading = true;

    this.error = null;

    this.audioBlobUrl = null;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Fehler beim Laden der Audiodatei`);

      const blob = await response.blob();
      
      if (blob.type !== 'audio/webm') {
        throw new Error(`Ungültiges Format: ${blob.type}`);
      }

      this.audioBlobUrl = URL.createObjectURL(blob);
    } catch (err: any) {
      this.error = err.message || 'Unbekannter Fehler';
    } finally {
      this.loading = false;
    }
  }
}
