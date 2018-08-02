delimiter $$
drop procedure if exists p_shift;
create procedure p_shift() 
	begin

	declare n int default 0;
    declare i int default 0;
    declare c int default 0;
    declare k int default 0;

    select count(*) from entity into n;
    set i = 0;
    #alter table closure drop foreign key fk_id;
    while i <= n do
       set k = n - i;
       select id from entity limit k, 1 into c;
       update entity set id = id + 1 where id = c;
       set i = i  + 1;
    end while;   
	
    

    end;
 $$

 delimiter ;