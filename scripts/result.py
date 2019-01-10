"""
filename: result.py
author: Abdulwali Yahaya <abdulwaliyahaya@gmail.com>
github repo: http://github.com/abdulwaliyahaya/resultCompiler
last modified: 10/13/2018
"""


class Compiler:
    """
    This class (Compiler) compiles result of students.
    It accepts scores of students (including attendance record and remark) as a list of list (or tuple)
    e.g [('Maths','English', 'Drawing', 'Attendance','Remark'),
         ('fas13geo001',43,76,54,123, 'average student... try harder'),
         ('fas13geo002',89,78,67,124, 'an excellent result... keep it up')
         ]
    and with this, it compiles total score for each student, his average and position,
    it also compiles student position for each subject.
    each student result can be accessed passing his name as parameter to the 'specific_student_result' method
    """
    def __init__(self, raw_result):

        self.raw_result = raw_result
        self.student_list = [row[0] for row in self.raw_result[1:]]
        self.subject_list = [subject for subject in self.raw_result[0][:-2]]
        self.student_record = [row[:-2] for row in self.raw_result[1:]]
        self.student_total = {}
        self.position = {}
        self.student_result = {}
        self.subject_result = {}
        self.subject_position = {}
        self.attendance = {}
        self.remark = {}

        # run the computation
        self.run()

    def compute_student_total(self):
        """add each student score for all subjects to generate total score for student """
        for student in self.student_list:
            self.student_total[student] = sum([record[1:] for record in self.student_record if student == record[0]][0])

    def compute_overall_position(self):
        """rank students by total score and generate for each his/her position in class,
        save position in self.position"""
        scores = [total for total in self.student_total.values()]
        score_tally = {}
        for score in scores:
            score_tally[score] = len([s for s in scores if s == score])
        unique_scores = sorted(score_tally, reverse=True)
        score_position_tally = [[number, (score, score_tally[score])]
                                for number, score in enumerate(unique_scores, start=1)]
        for number, score in enumerate(score_position_tally, start=1):
            previous = score_position_tally[number - 2][0]
            previous_count = score_position_tally[number - 2][1][1]
            if number == 1:
                previous = 0
                previous_count = 1
            current_position = previous + previous_count
            score_position_tally[number - 1][0] = current_position
        for position, score in score_position_tally:
            self.position[position] = [row[0] for row in self.student_total.items() if row[1] == score[0]]

    def parse_student_scores(self):
        """parse student score for each subject and save it in self.student_result"""
        for student in self.student_list:
            self.student_result[student] = {}
            for record in self.student_record:
                if record[0] == student:
                    for num, subject in enumerate(self.subject_list):
                        self.student_result[student][subject] = [record[num + 1]
                                                                 for record in self.student_record
                                                                 if record[0] == student][0]

    def parse_subject_scores(self):
        """parse scores for each subject"""
        for number, subject in enumerate(self.subject_list):
            self.subject_result[subject] = {record[0]: record[number + 1]
                                            for record_number, record in enumerate(self.student_record)}

    def compute_subject_positions(self):
        """rank students by score in subjects and generate for each his/her position in each subject,
                save subject position in self.subject_position"""
        for subject in self.subject_list:
            self.subject_position[subject] = {}
            scores = [total for total in self.subject_result[subject].values()]
            score_tally = {}
            for score in scores:
                score_tally[score] = len([s for s in scores if s == score])
            unique_scores = sorted(score_tally, reverse=True)
            score_position_tally = [[number, (score, score_tally[score])] for number, score in
                                    enumerate(unique_scores, start=1)]

            for number, score in enumerate(score_position_tally, start=1):
                previous = score_position_tally[number - 2][0]
                previous_count = score_position_tally[number - 2][1][1]
                if number == 1:
                    previous = 0
                    previous_count = 1
                current_position = previous + previous_count
                score_position_tally[number - 1][0] = current_position
            for position, score in score_position_tally:
                self.subject_position[subject][position] = [row[0]
                                                            for row in self.subject_result[subject].items()
                                                            if row[1] == score[0]]

    def parse_attendance_remark(self):
        """parse each student attendance and remark from self.raw_result"""
        for row in self.raw_result[1:]:
            student = row[0]
            attendance = row[-2]
            remark = row[-1]
            self.attendance[student] = attendance
            self.remark[student] = remark

    def specific_student_result(self, student):
        """
        accepts student name as parameter and returns 1. overall_result consisting of his/her
        position, total score, average, attendance and remark. 2. subject result consisting of
        score and position for each subject
        """
        overall_result = {
            'position': 0,
            'total_score': 0,
            'average': 0,
            'attendance': 0,
            'remark': 0,
        }
        subject_result = {subject: {'score': 0, 'position': 0} for subject in self.subject_list}
        for subject, mark in self.student_result[student].items():
            subject_result[subject]['score'] = mark
        for subject in self.subject_list:
            for position, student_list in self.subject_position[subject].items():
                if student in student_list:
                    subject_result[subject]['position'] = position
        for position, student_list in self.position.items():
            if student in student_list:
                overall_result['position'] = position
        overall_result['total_score'] = self.student_total[student]
        average = self.student_total[student] / (len(self.subject_list) * 100) * 100
        overall_result['average'] = round(average, 1)
        overall_result['attendance'] = self.attendance[student]
        overall_result['remark'] = self.remark[student]
        return {
            'student': student,
            'overall_result': overall_result,
            'subject_result': subject_result
        }

    def run(self):
        """call all the class methods that aid in the compilation"""
        self.compute_student_total()
        self.compute_overall_position()
        self.parse_student_scores()
        self.parse_subject_scores()
        self.compute_subject_positions()
        self.parse_attendance_remark()
