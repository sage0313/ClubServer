
/* ticketdb_dml.sql */
insert into item(id, name, description, type, money) values(1, '대인 티켓', '대인 자유이용권(+식음료권 2매, 세미뷔페 1매)' , 'ticket', 0);
insert into item(id, name, description, type, money) values(2, '소인 티켓', '소인 자유이용권(+식음료권 1매, 세미뷔페 1매, 어린이 선물 1매)','ticket', 0);
insert into item(id, name, description, type, money) values(3, '식음료권', '식음료권 5000원 : 선구매 하신분들에게 대안2매, 소인 1매','ticket', 0);
insert into item(id, name, description, type, money) values(4, '세미뷔페', '서문 행사장 세미뷔피 쿠폰 : 사람당 1매' , 'ticket', 0);
insert into item(id, name, description, type, money) values(5, '어린이선물', '어린이 선물 쿠폰 : 소인 당 1매' , 'ticket', 0);
insert into item(id, name, description, type, money) values(6, '직원선물', '직원선물 쿠폰 : 정규직원 당 1매' , 'ticket', 0);
insert into item(id, name, description, type, money) values(7, '현금 대인 티켓', '(현금구매) 대인 자유이욕권','cash', 19000);
insert into item(id, name, description, type, money) values(8, '현금 소인 티켓', '(현금구매) 소인 자유이용권','cash', 13000);
insert into item(id, name, description, type, money) values(9, '추가 대인 티켓', '(추가구매:구매최대수량초과시) 대인 자유이욕권','cash', 28000);
insert into item(id, name, description, type, money) values(10, '추가 소인 티켓', '(추가구매:구매최대수량초과시) 소인 자유이용권','cash', 12000);
insert into item(id, name, description, type, money) values(11, '기타 금액', '기타 금액 사용 1매당 1원 카운트','cash', 1);



insert into user(userid, username, userpwd, role) values('admin', 'Administrator', password('passw0rd'), 'admin');
insert into user(userid, username, userpwd, role) values('sksim', 'SungKyu Sim', password('passw0rd'), 'admin');
insert into user(userid, username, userpwd, role) values('yjkim', 'Yongjun Kim', password('passw0rd'), 'admin');
insert into user(userid, username, userpwd, role) values('test01', 'test01user', password('passw0rd'), 'user');

-- insert into employee(sn, name, phone, part, status) values('012345', 'SungKyu Sim', '010-0000-0000', 'KLAB', 'Init');
-- insert into employee(sn, name, phone, part, status) values('123456', 'YongJun Kim', '010-1111-1111', 'KLAB', 'Init');
-- insert into employee(sn, name, phone, part, status) values('234567', 'Nuri Kim', '010-2222-2222', 'GB', 'Init');
-- insert into employee(sn, name, phone, part, status) values('345678', 'Youngju Jung', '010-3333-3333', 'GTS', 'Init');
insert into employee(sn, name, phone, visitdate, ismarriage, status, rcv_name, rcv_phone, part,  msg) 
	values('052825', '김혜윤', '010-4995-5971','2014.05.24', '기혼' , '입금완료' , '김혜윤', '010-4995-5971', 'GTS',  '-' );
insert into employee(sn, name, phone, visitdate, ismarriage, status, rcv_name, rcv_phone, part,  msg) 
	values('052822', '김혜윤', '010-4995-5971','2014.05.24', '기혼' , '입금완료' , '김혜윤', '010-4995-5971', 'GTS',  '-' );
insert into employee(sn, name, phone, visitdate, ismarriage, status, rcv_name, rcv_phone, part,  msg) 
	values('052823', '김혜윤', '010-4995-5971','2014.05.24', '기혼' , '입금완료' , '김혜윤', '010-4995-5971', 'GTS',  '-' );
insert into employee(sn, name, phone, visitdate, ismarriage, status, rcv_name, rcv_phone, part,  msg) 
	values('052824', '김혜윤', '010-4995-5971','2014.05.24', '기혼' , '입금완료' , '김혜윤', '010-4995-5971', 'GTS',  '-' );



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

