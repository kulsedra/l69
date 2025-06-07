import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgAudioRecorderService, OutputFormat, ErrorCase } from '../../lib/AudioRecorder';

@Component({
  selector: 'app-audio-recorder',
  imports: [CommonModule],
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.css'],
  providers: [NgAudioRecorderService]
})
export class AudioRecorderComponent {
  @Input() set file(inputFile: File | null) {
    if (inputFile) {
      this.loadAudioFile(inputFile);
    }
  }

  @Output() fileRecorded = new EventEmitter<File>();

  audioURL: string | null = null;

  isRecording = false;

  isPaused = false;

  error: string | null = null;

  timer = 0;

  private intervalId: any;

  constructor(private audioService: NgAudioRecorderService) {
    this.audioService.recorderError.subscribe(err => {
      this.error = 'Fehler: ' + ErrorCase[err];
    });
  }

  start() {
    this.audioService.startRecording();

    this.isRecording = true;

    this.isPaused = false;

    this.error = null;

    this.startTimer();
  }

  pause() {
    this.audioService.pause();

    this.isPaused = true;

    this.stopTimer();
  }

  resume() {
    this.audioService.resume();

    this.isPaused = false;

    this.startTimer();
  }

  stop() {
    this.audioService.stopRecording(OutputFormat.WEBM_BLOB).then((blob: any) => {
      const recordedFile = new File([blob], `recording-${Date.now()}.webm`, { type: blob.type });

      this.audioURL = URL.createObjectURL(recordedFile);

      this.fileRecorded.emit(recordedFile);

      this.isRecording = false;

      this.isPaused = false;

      this.stopTimer();

      this.timer = 0;
    });
  }

  private startTimer() {
    this.intervalId = setInterval(() => this.timer++, 1000);
  }

  private stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  formatTime(seconds: number): string {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');

    const sec = (seconds % 60).toString().padStart(2, '0');

    return `${min}:${sec}`;
  }

  private loadAudioFile(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      this.audioURL = reader.result as string;
    };

    reader.readAsDataURL(file);
  }
}
