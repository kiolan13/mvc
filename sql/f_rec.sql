delimiter $$

drop function if exists f_rec;
create function f_rec (i int)
  returns int
  begin
  
    declare r int;
    select parent_id from closure where child_id = i limit 1 into r;
    
    return r;
  end;
  $$

delimiter ;