export const getAge = (ssn: string): number => {
  var today = new Date();

  var birthCentury = ssn.substring(9, 10); // can be 8, 9 or 0
  var birthDay = parseInt(ssn.substring(0, 2))
  var birthMonth = parseInt(ssn.substring(2, 4))
  var birthYear = parseInt((birthCentury != "0" ? "1" : "2") + birthCentury + ssn.substring(4, 6))
  var birthDate = new Date(birthYear, birthMonth - 1, birthDay);

  var age = today.getFullYear() - birthDate.getFullYear();
  var monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  return age;
}
