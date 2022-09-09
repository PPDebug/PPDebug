import java.util.Random;
import java.util.concurrent.CountDownLatch;

public class CountDownLatchTest {
    private static final int N_THREAD = 5;

    public static void main(String[] args) throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(N_THREAD);
        Random random = new Random();
        
        Runnable initialRunner = () -> {
            System.out.println(Thread.currentThread().getName() + " start...");
            try {
                Thread.sleep(random.nextInt(N_THREAD * 1000));
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            System.out.println(Thread.currentThread().getName() + " finished!");
            latch.countDown();
        };

        for (int i = 0; i < N_THREAD; i++) {
            new Thread(initialRunner, "InitialTask-" + i).start();
        }

        System.out.println("Main task wait...");
        latch.await();
        System.out.println("Main task running...");
    }
}
