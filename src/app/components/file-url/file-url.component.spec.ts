import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUrlComponent } from './file-url.component';

describe('FileUrlComponent', () => {
  let component: FileUrlComponent;
  let fixture: ComponentFixture<FileUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUrlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
