DROP TABLE IF EXISTS patient_analysis;

DROP TABLE IF EXISTS doctor_appointment;

DROP TABLE IF EXISTS doctor;

DROP TABLE IF EXISTS disease_history;

DROP TABLE IF EXISTS analysis;

DROP TABLE IF EXISTS department;

DROP TABLE IF EXISTS patient;

DROP TABLE IF EXISTS account;   


CREATE TABLE account(
    id serial,
    fname varchar(128) NOT NULL,
    lname varchar(128) NOT NULL,
    email varchar(128) UNIQUE NOT NULL,
    password varchar(128) NOT NULL,
    phone varchar(20) UNIQUE NOT NULL,
    role varchar(128) NOT NULL,
    CONSTRAINT account_pk PRIMARY KEY (id)
) WITH (
    OIDS=FALSE
);

CREATE TABLE department(
    id serial,
    name varchar(128) UNIQUE NOT NULL,
    CONSTRAINT department_pk PRIMARY KEY (id)
) WITH (
    OIDS=FALSE
);

CREATE TABLE doctor (
    account_id integer NOT NULL,
    admission_duration integer NOT NULL,
    schedule json NOT NULL,
    department_id integer NOT NULL,
    CONSTRAINT doctor_pk PRIMARY KEY (account_id),
    CONSTRAINT doctor_account_fk FOREIGN KEY (account_id) REFERENCES account(id),
    CONSTRAINT doctor_department_fk FOREIGN KEY (department_id) REFERENCES department(id)
) WITH (
    OIDS=FALSE
);

CREATE TABLE patient (
    account_id integer,
    passport varchar(128) unique NOT NULL,
    CONSTRAINT patient_pk PRIMARY KEY (account_id),
    CONSTRAINT patient_account_fk FOREIGN KEY (account_id) REFERENCES account(id)
) WITH (
    OIDS=FALSE
);

CREATE TABLE doctor_appointment (
    id serial,
    start_date timestamp NOT NULL,
    end_date timestamp NOT NULL,
    patient_id integer NOT NULL,
    doctor_id integer NOT NULL,
    CONSTRAINT doctor_appointment_pk PRIMARY KEY (id),
    CONSTRAINT doctor_appointment_doctor_fk FOREIGN KEY (doctor_id) REFERENCES doctor (account_id),
    CONSTRAINT doctor_appointment_patient_fk FOREIGN KEY (patient_id) REFERENCES patient (account_id)
) WITH (
    OIDS=FALSE
);

CREATE TABLE disease_history (
    id serial,
    name varchar(128),
    description json NOT NULL,
    start_date timestamp NOT NULL,
    patient_id integer NOT NULL, 
    CONSTRAINT disease_history_pk PRIMARY KEY (id),
    CONSTRAINT disease_history_patient_fk FOREIGN KEY (patient_id) REFERENCES patient (account_id)
) WITH (
    OIDS=FALSE
);

CREATE TABLE analysis (
    id serial,
    name varchar(128) UNIQUE NOT NULL,
    duration integer NOT NULL,
    schedule json NOT NULL,
    CONSTRAINT analysis_pk PRIMARY KEY (id)
) WITH (
    OIDS=FALSE
);

CREATE TABLE patient_analysis (
    id serial,
    status varchar(128) NOT NULL,
    result json NOT NULL,
    start_date timestamp NOT NULL,
    appointment_id integer NOT NULL,
    analysis_id integer NOT NULL,
    CONSTRAINT patient_analysis_pk PRIMARY KEY (id),
    CONSTRAINT patient_analysis_doctor_appointment_fk FOREIGN KEY (appointment_id) REFERENCES doctor_appointment(id),
    CONSTRAINT patient_analysis_analysis_fk FOREIGN KEY (analysis_id) REFERENCES analysis (id)
) WITH (
    OIDS=FALSE
);