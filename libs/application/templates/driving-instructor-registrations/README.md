```python
"""
Driving Instructor Registrations Script
This script is a template used for handling driving instructor registrations.
"""

class DrivingInstructor:
    """
    A class representing a driving instructor.

    Attributes:
        name (str): The name of the instructor.
        license_number (str): The instructor's license number, must be unique.
        phone_number (str): The contact phone number of the instructor.
        email (str): The email address of the instructor.
    """

    def __init__(self, name: str, license_number: str, phone_number: str, email: str):
        """
        Initialize a new instance of DrivingInstructor.

        Args:
            name (str): The name of the instructor.
            license_number (str): The license number of the instructor.
            phone_number (str): The contact phone number.
            email (str): The email address of the instructor.
        """
        self.name = name
        self.license_number = license_number
        self.phone_number = phone_number
        self.email = email

    def __str__(self) -> str:
        """
        Returns a string representation of the driving instructor's information.

        Returns:
            str: Details of the instructor including name, license number, phone, and email.
        """
        return (f"Instructor Name: {self.name}, License Number: {self.license_number}, "
                f"Phone: {self.phone_number}, Email: {self.email}")


class RegistrationSystem:
    """
    A class to handle registrations of driving instructors.

    Attributes:
        instructors (list): A list of registered driving instructors.
    """

    def __init__(self):
        """
        Initialize the RegistrationSystem with an empty list of instructors.
        """
        self.instructors = []

    def register_instructor(self, instructor: DrivingInstructor) -> bool:
        """
        Register a new driving instructor.

        Args:
            instructor (DrivingInstructor): The instructor to be registered.

        Returns:
            bool: True if registration is successful, False if the license number already exists.
        """
        if any(inst.license_number == instructor.license_number for inst in self.instructors):
            print(f"Registration failed: License number {instructor.license_number} already exists.")
            return False

        self.instructors.append(instructor)
        print(f"Instructor {instructor} registered successfully.")
        return True

    def find_instructor(self, license_number: str) -> DrivingInstructor:
        """
        Find an instructor by their license number.

        Args:
            license_number (str): The license number to search for.

        Returns:
            DrivingInstructor: The instructor with the matching license number, or None if not found.
        """
        for instructor in self.instructors:
            if instructor.license_number == license_number:
                return instructor
        print(f"No instructor found with license number: {license_number}.")
        return None

    def list_instructors(self) -> None:
        """
        List all registered instructors.

        Prints:
            A list of all registered driving instructors.
        """
        if not self.instructors:
            print("No instructors registered.")
        else:
            for instructor in self.instructors:
                print(instructor)

# Usage of the Registration System should happen outside this module in a proper file.
```
