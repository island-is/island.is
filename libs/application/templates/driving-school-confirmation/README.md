```python
"""
driving_school_confirmation.py

This script manages driving school course confirmations for students.
"""

class DrivingSchoolConfirmation:
    """
    A class to represent and handle the confirmation details of a driving school course for a student.

    Attributes:
    ----------
    student_name : str
        The name of the student.
    course_name : str
        The name of the driving course the student is enrolled in.
    confirmed : bool
        A status indicating whether the course enrollment is confirmed.

    Methods:
    -------
    confirm_course():
        Confirms the student's enrollment in the course.
    display_confirmation():
        Outputs confirmation details to the console regarding the course enrollment.
    """

    def __init__(self, student_name, course_name):
        """
        Initializes the DrivingSchoolConfirmation object with a student's name and course name.

        Parameters:
        ----------
        student_name : str
            The name of the student.
        course_name : str
            The name of the driving course the student is enrolled in.
        """
        self.student_name = student_name
        self.course_name = course_name
        self.confirmed = False

    def confirm_course(self):
        """
        Confirms the student's enrollment in the driving course by setting the 'confirmed' attribute to True.
        """
        self.confirmed = True

    def display_confirmation(self):
        """
        Displays the confirmation details to the console. 
        Shows the student's name, the course name, and the confirmation status.
        """
        status = "confirmed" if self.confirmed else "not confirmed"
        print(f"Student: {self.student_name}\nCourse: {self.course_name}\nStatus: {status}")

# Example usage:
# confirmation = DrivingSchoolConfirmation("John Doe", "Introductory Driving")
# confirmation.confirm_course()
# confirmation.display_confirmation()
```