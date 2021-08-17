export type DegreeCategory = Degree[];

export type Degree = string;

export type UniversityDegree = string;

export type EducationYear = number;

export interface EducationDegree {
    degreeCategory: DegreeCategory[];
    universityDegree?: UniversityDegree[];
    educationYearStart: EducationYear[];
    educationYearStop: EducationYear[];
}

export interface Education {
    educationDegree: EducationDegree[];
    addedInfo: string;
}