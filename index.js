'use_strict';
const fs = require('fs');

/*
    Max Group Size = 20,
    Min Group Size = 10,

    if more than 20 students select a group, it can be split into 2 groups, 
    each subject can have max 2 groups,
*/


const subjects = ["Physics", "Chemistry", "History", "Geography", "Computer Science"];
const outputFile = "output.txt";
let students;
let subjectsChoice = [[], [], [], [], []];
let subscribedSuject = [], overSubscribedSubjects = [];
let unSubscribedSubjects = [], underSubscribedSubjects = [];
let properlySubscribedSubjects = [];
let noOfChoicesLeft = 0;
let defaulters = [], studentsSubscribedToSingleGroup = [];
let sparePlaces = [], totalSparePlaces = 0;

let setup = () => {
    //READ FILE INTO A JAVASCRIPT ARRAY 
    let rawdata = fs.readFileSync('input-data.json');
    if (fs.existsSync(outputFile)) {
        fs.truncateSync(outputFile, 0);
    }

    students = JSON.parse(rawdata);

}

let taskOne = () => {
    students.forEach(choice => {
        //Adding Students who have not chosen any subjects
        if (!choice.subject1 && !choice.subject2) {

            defaulters.push(choice);

        }

        //Filtering Students who have chosen the same subject for both choices
        //It is counted as one choice
        if (choice.subject1 && choice.subject2 && choice.subject1 === choice.subject2) {
            noOfChoicesLeft += 1;
            studentsSubscribedToSingleGroup.push(choice.name);
            return subjectsChoice[choice.subject1].push(choice);

        }



        //NULL/undefined checks
        if (choice.subject1) {

            subjectsChoice[choice.subject1].push(choice);

        } else {
            noOfChoicesLeft += 1;
        }
        if (choice.subject2) {

            subjectsChoice[choice.subject2].push(choice);

        } else {
            noOfChoicesLeft += 1;

        }
    });
    listInitialData();

}

let taskTwo = async () => {
    fs.appendFileSync(outputFile, "\nTASK 2 => Names of students in each Subject Group\n");
    //List student names under their choices
    subjectsChoice.map((choices, index) => {
        fs.appendFileSync(outputFile, subjects[index] + "\n");

        //Deciding Selected Subjects and Unselected Subjects
        if (choices.length === 0) {
            unSubscribedSubjects.push(subjects[index]);
        } else {
            subscribedSuject.push(subjects[index]);
        }

        //Deciding Over and Under Subscribed Subjects
        if (choices.length < 10) {
            underSubscribedSubjects.push({ subjectName: subjects[index], index });
        } else if (choices.length >= 10 && choices.length <= 20) {

            properlySubscribedSubjects.push({ subjectName: subjects[index], index });
            sparePlaces.push({ subjectName: subjects[index], index, sparePlace: 20 - choices.length, total: 20, })
        } else if (choices.length > 20) {
            overSubscribedSubjects.push({ subjectName: subjects[index], index })
            sparePlaces.push({ subjectName: subjects[index], index, sparePlace: 40 - choices.length, total: 40 })
        }

        choices.map((choice) => {
            fs.appendFileSync(outputFile, choice.name + "\n");
        });

        fs.appendFileSync(outputFile, "\n\n");
    });

    listDefaulters();
    listSelectedAndUnselectedSubjects();
    listSubscribedAndUnscbscribedSubjects();
    listStudentsInSingleGroup();
}

let taskThree = () => {

    listSparePlaces();


}

let main = () => {
    setup();
    taskOne();
    taskTwo();
    taskThree();
}

let listDefaulters = () => {
    //List all students who have no selected any subject;
    fs.appendFileSync(outputFile, "\nStudents who have not selected any subject, thus not allocated to any group\n");
    defaulters.map((student) => {
        fs.appendFileSync(outputFile, student.name + "\n");
    })
}

let listSelectedAndUnselectedSubjects = () => {
    //List all Selected and Unselected Subjects;
    fs.appendFileSync(outputFile, "\nUnSelected Subjects\n");
    unSubscribedSubjects.map((subject) => {
        fs.appendFileSync(outputFile, subject + "\n");
    });

    fs.appendFileSync(outputFile, "\nSelected Subjects\n");
    subscribedSuject.map((subject) => {
        fs.appendFileSync(outputFile, subject + "\n");
    });

}

let listSubscribedAndUnscbscribedSubjects = () => {
    //List Under Subscribed & OverSubscribed and ProperlySubscribed Subjects
    fs.appendFileSync(outputFile, "\nUnder Subscribed Subjects\n");
    underSubscribedSubjects.map((subject) => {
        fs.appendFileSync(outputFile, subject.subjectName + "\n");
    });

    fs.appendFileSync(outputFile, "\nOver Subscribed Subjects\n");
    overSubscribedSubjects.map((subject) => {
        fs.appendFileSync(outputFile, subject.subjectName + "\n");
    });

    fs.appendFileSync(outputFile, "\nProperly Subjects\n");
    properlySubscribedSubjects.map((subject) => {
        fs.appendFileSync(outputFile, subject.subjectName + "\n");
    });

}

let listStudentsInSingleGroup = () => {
    //List Students who have subscribed to Single Group i.e both choices are the same subject
    fs.appendFileSync(outputFile, "\nStudents Subscribing to Single Subject\n");
    studentsSubscribedToSingleGroup.map((name) => {
        fs.appendFileSync(outputFile, name + "\n");
    });
}

let listSparePlaces = () => {
    fs.appendFileSync(outputFile, "\nSpare Places in Each Subject Group\n");
    sparePlaces.map((subject) => {
        totalSparePlaces += (subject.sparePlace);
        fs.appendFileSync(outputFile, subject.subjectName + " = " + subject.sparePlace + "/" + subject.total + "\n");
    });

    fs.appendFileSync(outputFile, "\nTotal Spare Places " + totalSparePlaces);
    fs.appendFileSync(outputFile, "\nTotal Unallocated Choices " + noOfChoicesLeft);

}

let listInitialData = () => {

    fs.appendFileSync(outputFile, "TASK 1 => The Subject and its Distrubution based on Data.\n");

    subjectsChoice.map(async (item, index) => {
        fs.appendFileSync(outputFile, subjects[index] + " = " + item.length + "\n");
    });
}

main();





