package demo;

public interface StundentDAO {
    void save(Student student);

    Student findById(int id);

}
