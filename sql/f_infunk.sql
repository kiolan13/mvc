delimiter $$

drop function if exists infunc;
create function infunc(v int) 
	returns varchar (20)
	begin 
	return concat("Hello !!! - ", v);
	end;
$$

delimiter ;