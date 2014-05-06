
/* ticketdb_dml.sql */
insert into item(name, description, type, money) values('Adult Ticket', 'Adult Everland Ticket','ticket', 0);
insert into item(name, description, type, money) values('Child Ticket', 'Child Everland Ticket','ticket', 0);
insert into item(name, description, type, money) values('Employee Gift', 'Employee Gift' , 'ticket', 0);
insert into item(name, description, type, money) values('Adult Cash Ticket', 'Adult Everland Cash Ticket','ticket', 20000);
insert into item(name, description, type, money) values('Child Cash Ticket', 'Child Everland Cash Ticket','ticket', 18000);



insert into user(userid, username, userpwd, role) values('sksim', 'SungKyu Sim', password('passw0rd'), 'admin');
insert into user(userid, username, userpwd, role) values('yjkim', 'Yongjun Kim', password('passw0rd'), 'admin');
insert into user(userid, username, userpwd, role) values('test01', 'test01user', password('passw0rd'), 'user');

insert into employee(sn, name, phone, part, status) values('012345', 'SungKyu Sim', '010-0000-0000', 'KLAB', 'Init');
insert into employee(sn, name, phone, part, status) values('123456', 'YongJun Kim', '010-1111-1111', 'KLAB', 'Init');
insert into employee(sn, name, phone, part, status) values('234567', 'Nuri Kim', '010-2222-2222', 'GB', 'Init');
insert into employee(sn, name, phone, part, status) values('345678', 'Youngju Jung', '010-3333-3333', 'GTS', 'Init');

insert into cart(emp_id,user_id, msg) values(4, 2, "inital ticket");
insert into item_in_cart(cart_id, item_id, spend_count) values(1, 1, 2);	
insert into item_in_cart(cart_id, item_id, spend_count) values(1, 3, 2);

insert into cart(emp_id,user_id, msg) values(4, 2, "ticket received");
insert into item_in_cart(cart_id, item_id, spend_count) values(2, 1, -1);	
insert into item_in_cart(cart_id, item_id, spend_count) values(2, 3, -1);

insert into cart(emp_id,user_id, msg) values(3, 2, "inital ticket");
insert into item_in_cart(cart_id, item_id, spend_count) values(3, 1, 2);	
insert into item_in_cart(cart_id, item_id, spend_count) values(3, 2, 2);
insert into item_in_cart(cart_id, item_id, spend_count) values(3, 3, 4);





/* admin user */ 

