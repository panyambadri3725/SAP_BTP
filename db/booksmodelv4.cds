namespace bookscapmv4.db;

entity GenderVH{
    key code: String(1);
    text : String;
}
entity AgeGroupVH{
    key code: String(1);
    text : String;
}

type statusText: String enum{
    C= 'Completed';
    I= 'InProgress';
}

type allgenders : String enum {
    Male   = 'M';
    Female = 'F';
}

type booksagegroup : String enum {
    Kids  = 'Kids';
    Adult = 'Adult';
}

entity Books {
    key ID        : UUID;
    title         : String(100);
    author        : String(100);
    price         : Decimal(10,2);
    publishedDate : DateTime;
    gender        : allgenders;
    ageGroup      : booksagegroup;
    status : statusText;
    chapters : Composition of many Chapters on chapters.books = $self;
}

entity Chapters {
    key ID    : UUID;
    title     : String;
    pages     : Integer;

    books     : Association to Books;
}
