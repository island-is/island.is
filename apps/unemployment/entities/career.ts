export interface JobCareer {
    employer: string;
    careerStart: Date;
    careerStop: Date;
    JobTitle: JobCategory[];
}

export interface JobCategory {
    name: string;
    job: JobTitle[];
}

export type JobTitle = string;

export interface Career {
    Career: JobCareer[];
    addedInfo: string;
}