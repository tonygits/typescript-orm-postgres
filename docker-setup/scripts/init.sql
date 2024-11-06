create user devuser with password 'der42g1jd7';
alter role devuser superuser createrole createdb replication;
create database devdb_test;
alter database devdb owner to devuser;
alter database devdb_test owner to devuser;
