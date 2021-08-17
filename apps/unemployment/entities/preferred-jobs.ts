export interface PreferredJob {
    jobCategory: JobCategory[];
}

export type JobCategory = Job[];
    
export type Job = string;