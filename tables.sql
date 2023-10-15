create table Users_(
    UserID int AUTO_INCREMENT NOT NULL, 
    Username varchar(255) not null,
    Type varchar(255) not null, 
    Email varchar(255) not null,
    Password varchar(255),
    PRIMARY KEY(UserID)
);

create Table Patient(    
    Patient_id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    Name varchar(100) NOT NULL,    
    Address varchar(200) NOT NULL,    
    Phone varchar(14) NOT NULL,
    Mail varchar(255) NOT NULL,
    Gender varchar(15) NOT NULL,
    DOB DATETIME NOT NULL,
    Registration_Date DATETIME NOT NULL
);

create Table Doctor(
    Name varchar(100) NOT NULL,
    Specialization varchar(50),
    Doctor_id int,
    Status tinyint NOT NULL default 1,
    Foreign Key(Doctor_id) References Users_(UserID) on delete set null
);

create Table Appointment(
    Appointment_id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    Patient_id int  NOT NULL,                           
    Doctor_id int,
    Scheduled_Date DATETIME NOT NULL,
    Booking_Date DATETIME NOT NULL,
    Slot varchar(15) NOT NULL,                           
    `Description` text(500),
    Foreign Key(Patient_id) References Patient(Patient_id),
    Foreign Key(Doctor_id) References Doctor(Doctor_id) on delete set null
);

create Table Room(    
    Room_no int AUTO_INCREMENT PRIMARY KEY NOT NULL,    
    Type varchar(100) NOT NULL,    
    Rem_capacity int NOT NULL, 
    Max_capacity int NOT NULL   
);
   
create table Stay(       
    Patient_id int PRIMARY KEY NOT NULL,    
    Room_no int NOT NULL,       
    Foreign KEY(Patient_id) References Patient(Patient_id),    
    Foreign Key(Room_no) References Room(Room_no)
    );

create table Treatment(    
    Treatment_id int AUTO_INCREMENT PRIMARY KEY NOT NULL,    
    Name varchar(100) NOT NULL,    
    Cost float NOT NULL
);

create Table Undergoes(  
    U_id int AUTO_INCREMENT NOT NULL,  
    Patient_id int NOT NULL,    
    Treatment_id int NOT NULL,       
    Scheduled_Date DATETIME,
    Slot   varchar(15),           
    Doctor int ,  
    Result text(500),    
    Primary Key(U_id),    
    Foreign Key(Patient_id) REFERENCES Patient(Patient_id),
    Foreign Key(Treatment_id) REFERENCES Treatment(Treatment_id),      
    Foreign Key(Doctor) References Doctor(Doctor_id) on delete set null
);

create table Test(  
     Test_id int PRIMARY KEY AUTO_INCREMENT NOT NULL,
     Name varchar(255) NOT NULL,
     Cost int NOT NULL
);

create table PrescribedTests(
     PT_id int AUTO_INCREMENT NOT NULL,
     Test_id int NOT NULL,
     Patient_id int NOT NULL,
     Doctor_id int,
     Scheduled_Date DATETIME,
     Result text(500),
     Primary Key(PT_id),    
     Foreign Key(Patient_id) REFERENCES Patient(Patient_id),    
     Foreign Key(Test_id) REFERENCES Test(Test_id),       
     Foreign Key(Doctor_id) References Doctor(Doctor_id) on delete set null
);


ALTER TABLE Users_ AUTO_INCREMENT=54321;
ALTER TABLE Appointment AUTO_INCREMENT=12345;
ALTER TABLE Room AUTO_INCREMENT=100;
ALTER TABLE Treatment AUTO_INCREMENT=34567;
ALTER TABLE Test AUTO_INCREMENT=29560;
ALTER TABLE Patient AUTO_INCREMENT=31425;



INSERT INTO Patient(    
    Patient_id ,    
    Name ,    
    Address ,    
    Phone ,
    Mail ,
    Gender ,
    DOB,
    Registration_date)
VALUES
(31400,'Chandu','lbs,bla,bla,bla','9699699699','bmc@gmail.com','Male','2000-01-01','2023-03-01'),
(31401,'Indu','mt,bla,bla,bla','9699698769','ind@gmail.com','Female','2000-02-01','2023-03-02'),
(31402,'Bindu','snig,bla,bla,bla','9697899699','bnd@gmail.com','Female','2000-03-01','2023-03-03');

INSERT INTO Room(Type ,Rem_capacity , Max_capacity )
VALUES
('ICU',1,1),
('VIP',1,1),
('General',3,3);


INSERT INTO Treatment(Name,Cost)
VALUES
('Bypass-surgery',369000.5),
('Liposuction',469000.7),
('Dialysis',35000.69),
('Lung-transplant',690000.69);


INSERT INTO Test(Name,Cost)
Values
('Blood-test',690),
('Urine-test',330),
('CT-scan',1578),
('X-ray',800),
('Mri',2000),
('Allergy test',1200);


