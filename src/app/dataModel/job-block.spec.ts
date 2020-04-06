
import { JobBlock } from './job-block';

describe('JobBlock', () => {
  it('should create an instance', () => {
    expect(new JobBlock('testJobBlock','jobid','jobcount','driver')).toBeTruthy();
  });
});