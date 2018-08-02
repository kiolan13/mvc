delimiter $$
drop procedure if exists m_func;
create procedure m_func() 
	begin
	set @i = 0;
	while(@i < 100000) do
	 select infunc(@i) as h;
	  set @i = @i + 1;
	end while;
    end;

 $$

 delimiter ;