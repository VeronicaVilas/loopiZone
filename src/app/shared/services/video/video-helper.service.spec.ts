import { TestBed } from '@angular/core/testing';

import { VideoHelperService } from './video-helper.service';

describe('VideoHelperService', () => {
  let service: VideoHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
