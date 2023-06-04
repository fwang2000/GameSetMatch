package com.zoomers.GameSetMatch.scheduling_test.unit.GraphTest;

import com.zoomers.GameSetMatch.repository.TournamentRepository;
import com.zoomers.GameSetMatch.scheduler.Scheduler;
import com.zoomers.GameSetMatch.scheduler.domain.MockTournament;
import com.zoomers.GameSetMatch.scheduler.exceptions.ScheduleException;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Calendar;

// import org.junit.jupiter.api.Test;

@RunWith( SpringRunner.class )
// @Import({TournamentRepository.class})
@SpringBootTest
// @EnableAutoConfiguration
// @DataJpaTest
public class GraphTests {

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private Scheduler scheduler;

    @Rule
    public Timeout globalTime = Timeout.seconds(900);

    @Test
    public void BasicDBIntegration() {

        try {

            scheduler.createSchedule(2);
        }
        catch (ScheduleException e) {

            System.out.println(e.getMessage());
        }
    }

    @Test
    public void DBIntegrationOne() {

        try {

            scheduler.createSchedule(5);
        }
        catch (ScheduleException e) {

            System.out.println(e.getMessage());
        }
    }

    @Test
    public void DBIntegrationRoundRobinTest() {
        for (int i = 0; i < 5; i++) {
            try {

                scheduler.createSchedule(1);
            }
            catch (ScheduleException e) {

                System.out.println(e.getMessage());
            }
        }
    }

    @Test
    public void IntegrationErrorRRTest() {

        try {

            scheduler.createSchedule(5);
        }
        catch (ScheduleException e) {

            System.out.println(e.getMessage());
        }
    }

    @Test
    public void DBIntegrationPriorityRoundRobinTest() {

        try {

            scheduler.createSchedule(5);
        }
        catch (ScheduleException e) {

            System.out.println(e.getMessage());
        }
    }

    @Test
    public void BackToBackScheduling() {
        for (int i = 1; i <=2; i++) {
            try {

                scheduler.createSchedule(i);
            }
            catch (ScheduleException e) {

                System.out.println(e.getMessage());
            }
        }
    }

    @Test
    public void BasicTest() {

        try {

            scheduler.createSchedule(4);
        }
        catch (ScheduleException e) {

            System.out.println(e.getMessage());
        }
    }

    @Test
    public void InitialSingleKnockoutSchedulingTest() {

        try {

            scheduler.createSchedule(6);
        }
        catch (ScheduleException e) {

            System.out.println(e.getMessage());
        }
    }

    @Test
    public void BracketMatchingTest() {
        try {
            scheduler.createSchedule(9);
        }
        catch (ScheduleException e) {

            System.out.println(e.getMessage());
        }
    }

    @Test
    public void StressTest() {
        try{
            scheduler.createSchedule(10);
        }
        catch (ScheduleException e) {
            System.out.println(e.getMessage());
        }
    }

    @Test
    public void StressTestSE() {
        try{
            scheduler.createSchedule(11);
        }
        catch (ScheduleException e) {
            System.out.println(e.getMessage());
        }
    }

    @Test
    public void DoubleEliminationTest() {
        try{
            scheduler.createSchedule(8);
        }
        catch (ScheduleException e) {
            System.out.println(e.getMessage());
        }
    }
}
