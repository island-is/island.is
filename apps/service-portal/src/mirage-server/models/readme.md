# User, Subject, Actor, Groups (Speculations, Atli)

### Actors and subjects

Given the following scenario:

_User John Doe logs into his account for the first time and sees his available subjects and their scopes_

Given that the authentication service exists and he makes an authenticated request for this national ID,
how do we return a correct model to the frontend?
Does the user already exist in the database or must he be initiated first?
How and when do we build up his default scope?
From a default standpoint, at least three things must be considered when initiating the user scope?

- A subject containing himself

  How much of his own subject scope does he have access to? A few things must be taken into consideration here:
  Is he over 18? Perhaps he suffers from a mental condition that has led him
  unfit to be in charge of his own scope?

- One or more subjects representing his children

  If he has children, does he have custody over them? How far into this schema does custody go
  and where is that defined?

- One or more subjects representing companies that he is a procurer of

  Procurers should by default have full access to a company, including the ability to delegate
  access to other users

Given the following scenario:

_User Mary Does logs into her account and sets the subject to Bananas Inc. She delegates access to viewing finance reports to John Doe_

A model for John Doe must be present in the database if we are going to be able to delegate access to him.
Should we create one on the go or should a model for him already exist in the database? If a model should already
exist for, are we going to import the entire population of Iceland (364k) into the database? Given that a new subject
model must be created for single user-subject relation, the amount of subjects could go up very fast.
`Icelanders * a user to himself as a subject + parents * their children + procurers * their companies = ~ 1 million subjects on the initial import?`

Given the following scenario:
_Jonathan Hopkins has reached the legal age of 18. He should be removed as a subject from his parent's scope and granted full access to himself_

How will we go about doing this? What about marriages, civil unions, deaths and so forth?

### Defining scopes for clients, users, subjects and actors
