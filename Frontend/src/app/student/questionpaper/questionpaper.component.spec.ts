import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionPaperComponent } from './questionpaper.component';

describe('QuestionpaperComponent', () => {
  let component: QuestionPaperComponent;
  let fixture: ComponentFixture<QuestionPaperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionPaperComponent]
    });
    fixture = TestBed.createComponent(QuestionPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
